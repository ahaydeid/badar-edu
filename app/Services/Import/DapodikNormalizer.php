<?php

namespace App\Services\Import;

class DapodikNormalizer
{
    public static function normalizeRombel(?string $raw): ?string
    {
        if (!$raw) return null;

        $raw = trim(strtoupper($raw));

        // contoh: "12 TSM 1"
        if (!preg_match('/^(10|11|12)\s+([A-Z]+)\s+(\d+)$/', $raw, $m)) {
            return null; // format tidak dikenali
        }

        [$full, $kelas, $jurusan, $urut] = $m;

        // angka ke romawi
        $romanMap = [
            '10' => 'X',
            '11' => 'XI',
            '12' => 'XII',
        ];

        // mapping jurusan RESMI SAJA
        $jurusanMap = [
            'TSM'  => 'TBSM',
            'TKR'  => 'TKR',
            'MPLB' => 'MPLB',
        ];

        if (!isset($romanMap[$kelas])) return null;
        if (!isset($jurusanMap[$jurusan])) return null;

        return "{$romanMap[$kelas]} {$jurusanMap[$jurusan]} {$urut}";
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
