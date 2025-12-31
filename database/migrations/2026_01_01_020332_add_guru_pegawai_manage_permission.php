<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $perm = \Spatie\Permission\Models\Permission::create(['name' => 'guru-pegawai.manage', 'guard_name' => 'web']);
        
        $role = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
        if ($role) {
            $role->givePermissionTo($perm);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $perm = \Spatie\Permission\Models\Permission::where('name', 'guru-pegawai.manage')->first();
        if ($perm) {
            $perm->delete();
        }
    }
};
