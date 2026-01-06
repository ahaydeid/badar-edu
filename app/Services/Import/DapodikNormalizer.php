<?php

namespace App\Services\Import;

class DapodikNormalizer
{
    public static function normalizeRombel(?string $raw): ?string
    {
        if (!$raw) return null;

        $raw = trim(strtoupper($raw));

        // Regex: 10/11/12 + SPASI + JURUSAN + (OPTIONAL SPASI + NOMOR)
        // contoh: "10 MPLB 1" atau "10 TKR"
        if (!preg_match('/^(10|11|12)\s+([A-Z]+)(?:\s+(\d+))?$/', $raw, $m)) {
            // Fallback: kembalikan apa adanya jika tidak match pattern,
            // barangkali user input "X TKR 1" manual dan di DB memang begitu.
            // Tapi untuk kasus ini kita coba return $raw saja biar ResolveRombelId yg urus fuzzy match.
            return $raw;  
        }

        $kelas = $m[1];
        $jurusan = $m[2];
        $urut = $m[3] ?? '';

        // mapping jurusan (Opsional, sesuaikan dengan DB)
        // Jika di DB pakai "TSM", jangan ubah ke "TBSM" kalau tidak perlu.
        // Tapi lihat data tadi "10 TBSM 1". 
        // Jika input Excel "TSM", kita ubah ke "TBSM".
        $jurusanMap = [
            'TSM'  => 'TBSM',
            // Tambahkan mapping lain jika perlu
        ];

        $jurusan = $jurusanMap[$jurusan] ?? $jurusan;

        // KEMBALIKAN FORMAT ANGKA (sesuai DB: 10 MPLB 1)
        if ($urut !== '') {
            return "{$kelas} {$jurusan} {$urut}";
        } else {
            return "{$kelas} {$jurusan}";
        }
    }

    public static function normalizeYesNo($v): bool
    {
        $v = strtoupper(trim((string)$v));
        return in_array($v, ['YA', 'Y', '1', 'YES']);
    }

    public static function normalizeNullable($v): ?string
    {
        $v = trim((string)$v);
        if ($v === '' || $v === '0' || $v === 'TIDAK SEKOLAH' || $v === 'SUDAH MENINGGAL') {
            return null;
        }
        return $v;
    }

    public static function normalizeCoordinate($v): ?float
    {
        if (!is_numeric($v)) return null;
        $v = (float)$v;

        // lintang/bujur Indonesia
        if ($v < -11 || $v > 11) return null;

        return $v;
    }

    public static function normalizeAnakKe($v): ?int
    {
        if (!is_numeric($v)) return null;

        $v = (int)$v;

        // batas masuk akal (realistis)
        if ($v < 1 || $v > 20) return null;

        return $v;
    }

}
