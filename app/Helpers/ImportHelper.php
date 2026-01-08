<?php

namespace App\Helpers;

use Carbon\Carbon;

class ImportHelper
{
    public static function yesNo($value): int
    {
        if ($value === null) return 0;

        $v = strtoupper(trim((string) $value));

        return in_array($v, ['YA', 'Y', 'YES', '1'], true) ? 1 : 0;
    }

    public static function date($value): ?string
    {
        if (!$value) return null;

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function number($value): ?int
    {
        if ($value === null) return null;

        $v = preg_replace('/[^0-9\-\.]/', '', (string) $value);

        return $v === '' ? null : (int) $v;
    }

    public static function text($value): ?string
    {
        if ($value === null) return null;

        $v = trim((string) $value);

        return $v === '' || $v === '0' ? null : $v;
    }

    public static function titleCase($value): ?string
    {
        if ($value === null) return null;

        $v = trim((string) $value);

        if ($v === '' || $v === '0') return null;

        // Convert to Title Case using mb_convert_case for UTF-8 support
        return mb_convert_case($v, MB_CASE_TITLE, 'UTF-8');
    }
}
