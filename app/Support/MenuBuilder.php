<?php

namespace App\Support;

class MenuBuilder
{
    public static function build(): array
    {
        return [
            [
                'label' => 'Dashboard',
                'href' => '/dashboard',
            ],
            [
                'label' => 'Academic',
                'children' => [
                    ['label' => 'Academic Years', 'href' => '/academic-years'],
                    ['label' => 'Semesters', 'href' => '/semesters'],
                    ['label' => 'Calendar Events', 'href' => '/events'],
                ],
            ],
        ];
    }
}
