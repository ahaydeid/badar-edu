<?php

namespace App\Http\Resources\API\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'roles' => $this->getRoleNames()->filter(function($role) {
                // Strictly hide devhero role from public view
                if ($role === 'devhero') {
                    return auth()->check() && auth()->user()->hasRole('devhero');
                }
                return true;
            })->values(),
        ];

        // Add guru data if profile is Guru
        if ($this->profile_type === 'App\Models\Guru' && $this->relationLoaded('profile')) {
            $data['guru'] = new GuruResource($this->profile);
        }

        return $data;
    }
}
