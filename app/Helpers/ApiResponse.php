<?php

namespace App\Helpers;

class ApiResponse
{
    /**
     * Success response
     */
    public static function success($data = null, $message = 'Success', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code)->withHeaders([
            'Cache-Control' => 'no-cache, no-store, max-age=0, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => 'Fri, 01 Jan 1990 00:00:00 GMT',
        ]);
    }

    /**
     * Error response
     */
    public static function error($message = 'Error', $code = 400, $errors = null)
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Validation error response
     */
    public static function validationError($errors, $message = 'Validation failed')
    {
        return self::error($message, 422, $errors);
    }

    /**
     * Unauthorized response
     */
    public static function unauthorized($message = 'Unauthorized')
    {
        return self::error($message, 401);
    }

    /**
     * Not found response
     */
    public static function notFound($message = 'Resource not found')
    {
        return self::error($message, 404);
    }
}
