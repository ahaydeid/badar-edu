<?php

/**
 * Test script for Weekly Schedule Endpoint
 * 
 * This script tests the guru-schedule API endpoint with and without the week parameter
 */

// Configuration
$baseUrl = 'http://localhost:3000/api/v1';
$testEmail = 'guru@test.com'; // You'll need to replace this with actual guru credentials
$testPassword = 'password';

echo "=== Weekly Schedule Endpoint Test ===\n\n";

// Step 1: Login to get token
echo "Step 1: Logging in...\n";
$loginData = [
    'email' => $testEmail,
    'password' => $testPassword
];

$ch = curl_init("$baseUrl/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$loginResponse = curl_exec($ch);
$loginData = json_decode($loginResponse, true);
curl_close($ch);

if (!isset($loginData['token'])) {
    echo "❌ Login failed. Please update test credentials.\n";
    echo "Response: " . $loginResponse . "\n";
    exit(1);
}

$token = $loginData['token'];
echo "✅ Login successful\n\n";

// Step 2: Test default endpoint (today's schedule)
echo "Step 2: Testing default endpoint (today's schedule)...\n";
echo "GET $baseUrl/guru-schedule\n";

$ch = curl_init("$baseUrl/guru-schedule");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Accept: application/json'
]);

$todayResponse = curl_exec($ch);
$todayData = json_decode($todayResponse, true);
curl_close($ch);

echo "Response:\n";
echo json_encode($todayData, JSON_PRETTY_PRINT) . "\n\n";

if (isset($todayData['success']) && $todayData['success']) {
    echo "✅ Today's schedule endpoint works\n";
    echo "   Found " . count($todayData['data']) . " schedule blocks for today\n\n";
} else {
    echo "❌ Today's schedule endpoint failed\n\n";
}

// Step 3: Test weekly endpoint
echo "Step 3: Testing weekly endpoint...\n";
echo "GET $baseUrl/guru-schedule?week=true\n";

$ch = curl_init("$baseUrl/guru-schedule?week=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Accept: application/json'
]);

$weeklyResponse = curl_exec($ch);
$weeklyData = json_decode($weeklyResponse, true);
curl_close($ch);

echo "Response:\n";
echo json_encode($weeklyData, JSON_PRETTY_PRINT) . "\n\n";

if (isset($weeklyData['success']) && $weeklyData['success']) {
    echo "✅ Weekly schedule endpoint works\n";
    
    // Verify structure
    $hasCorrectStructure = isset($weeklyData['data']['days']) && isset($weeklyData['data']['jadwals']);
    
    if ($hasCorrectStructure) {
        echo "✅ Response has correct structure (days + jadwals)\n";
        echo "   Days: " . count($weeklyData['data']['days']) . "\n";
        echo "   Schedules: " . count($weeklyData['data']['jadwals']) . "\n";
        
        // Verify required fields in jadwals
        if (count($weeklyData['data']['jadwals']) > 0) {
            $firstJadwal = $weeklyData['data']['jadwals'][0];
            $requiredFields = ['id', 'hari_id', 'jam_id', 'kelas_id', 'jp', 'guru_id', 'kelas', 'mapel', 'jamMulai', 'jamSelesai', 'jamPertama', 'jamKedua'];
            
            $missingFields = [];
            foreach ($requiredFields as $field) {
                if (!isset($firstJadwal[$field])) {
                    $missingFields[] = $field;
                }
            }
            
            if (empty($missingFields)) {
                echo "✅ All required fields present in jadwal items\n";
            } else {
                echo "❌ Missing fields: " . implode(', ', $missingFields) . "\n";
            }
        }
    } else {
        echo "❌ Response structure incorrect\n";
    }
} else {
    echo "❌ Weekly schedule endpoint failed\n";
}

echo "\n=== Test Complete ===\n";
