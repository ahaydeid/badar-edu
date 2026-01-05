<?php

namespace App\Services;

use App\Models\Jadwal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class JadwalVersionService
{
    /**
     * Create a new version of jadwal
     * 
     * @param int $jadwalId Original jadwal ID
     * @param array $newData New data for the schedule
     * @param Carbon|string $effectiveDate Date when new version becomes effective
     * @return Jadwal
     */
    public function createNewVersion($jadwalId, array $newData, $effectiveDate)
    {
        $effectiveDate = $effectiveDate instanceof Carbon ? $effectiveDate : Carbon::parse($effectiveDate);
        
        return DB::transaction(function () use ($jadwalId, $newData, $effectiveDate) {
            $oldJadwal = Jadwal::findOrFail($jadwalId);
            
            // Close the old version
            $oldJadwal->update([
                'berlaku_sampai' => $effectiveDate->copy()->subDay(),
                'is_active' => false
            ]);
            
            // Create new version
            $newJadwal = Jadwal::create([
                'parent_id' => $oldJadwal->parent_id ?? $oldJadwal->id,
                'version' => $oldJadwal->version + 1,
                'berlaku_dari' => $effectiveDate,
                'berlaku_sampai' => null,
                'is_active' => true,
                
                // Copy or use new data
                'hari_id' => $newData['hari_id'] ?? $oldJadwal->hari_id,
                'jam_id' => $newData['jam_id'] ?? $oldJadwal->jam_id,
                'kelas_id' => $newData['kelas_id'] ?? $oldJadwal->kelas_id,
                'guru_id' => $newData['guru_id'] ?? $oldJadwal->guru_id,
                'mapel_id' => $newData['mapel_id'] ?? $oldJadwal->mapel_id,
                'semester_id' => $oldJadwal->semester_id,
            ]);
            
            return $newJadwal;
        });
    }
    
    /**
     * Get jadwal effective on a specific date
     * 
     * @param int $hariId
     * @param int $jamId
     * @param int $kelasId
     * @param int $semesterId
     * @param Carbon|string $date
     * @return Jadwal|null
     */
    public function getJadwalByDate($hariId, $jamId, $kelasId, $semesterId, $date)
    {
        $date = $date instanceof Carbon ? $date : Carbon::parse($date);
        
        return Jadwal::where('hari_id', $hariId)
            ->where('jam_id', $jamId)
            ->where('kelas_id', $kelasId)
            ->where('semester_id', $semesterId)
            ->effectiveOn($date)
            ->first();
    }
    
    /**
     * Get all active jadwal for a semester
     * 
     * @param int $semesterId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveJadwal($semesterId)
    {
        return Jadwal::where('semester_id', $semesterId)
            ->active()
            ->with(['guru', 'mapel', 'kelas', 'hari', 'jam'])
            ->get();
    }
    
    /**
     * Archive all jadwal in a semester
     * 
     * @param int $semesterId
     * @return int Number of jadwal archived
     */
    public function archiveSemester($semesterId)
    {
        return Jadwal::where('semester_id', $semesterId)
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'berlaku_sampai' => now()
            ]);
    }
    
    /**
     * Get version history of a jadwal
     * 
     * @param int $jadwalId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getVersionHistory($jadwalId)
    {
        $jadwal = Jadwal::findOrFail($jadwalId);
        $parentId = $jadwal->parent_id ?? $jadwal->id;
        
        return Jadwal::where('id', $parentId)
            ->orWhere('parent_id', $parentId)
            ->orderBy('version', 'asc')
            ->with(['guru', 'mapel', 'kelas', 'hari', 'jam'])
            ->get();
    }
    
    /**
     * Check if jadwal can be safely updated
     * 
     * @param int $jadwalId
     * @return array ['can_update' => bool, 'reason' => string|null]
     */
    public function canUpdate($jadwalId)
    {
        $jadwal = Jadwal::findOrFail($jadwalId);
        
        $hasAbsenGuru = DB::table('absen_guru')
            ->where('jadwal_id', $jadwalId)
            ->exists();
            
        $hasAbsenJp = DB::table('absen_jp')
            ->where('jadwal_id', $jadwalId)
            ->exists();
        
        if ($hasAbsenGuru || $hasAbsenJp) {
            return [
                'can_update' => false,
                'reason' => 'Jadwal memiliki data absensi. Gunakan createNewVersion() untuk membuat versi baru.'
            ];
        }
        
        return [
            'can_update' => true,
            'reason' => null
        ];
    }
}
