<?php

namespace App\Helpers;

class GeofenceHelper
{
    /**
     * Menghitung jarak antara dua koordinat menggunakan rumus Haversine.
     * Hasil dalam meter.
     */
    public static function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Radius bumi dalam meter

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $angle * $earthRadius;
    }

    /**
     * Memeriksa apakah koordinat berada dalam jangkauan salah satu lokasi kantor yang aktif.
     */
    public static function isInRange($lat, $lng, $locations)
    {
        foreach ($locations as $location) {
            $distance = self::calculateDistance($lat, $lng, $location->latitude, $location->longitude);
            if ($distance <= $location->radius) {
                return true;
            }
        }
        return false;
    }
}
