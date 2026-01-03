<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanupAttendancePhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:cleanup-photos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghapus foto selfie absensi guru yang sudah lewat hari.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = \Carbon\Carbon::today();
        
        $oldAttendances = \App\Models\AbsenGuru::where('tanggal', '<', $today->toDateString())
            ->whereNotNull('foto_selfie')
            ->get();

        $count = 0;
        foreach ($oldAttendances as $absen) {
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($absen->foto_selfie)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($absen->foto_selfie);
            }
            
            $absen->update(['foto_selfie' => null]);
            $count++;
        }

        $this->info("Berhasil membersihkan {$count} foto absensi lama.");
    }
}
