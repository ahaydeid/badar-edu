<x-mail::message>
# Halo, {{ $user->nama_lengkap }}!

Terima kasih telah melakukan registrasi akun PPDB. Untuk melanjutkan proses pendaftaran, silakan masukkan kode verifikasi berikut:

<x-mail::panel>
# {{ $otp }}
</x-mail::panel>

Kode ini berlaku selama **10 menit**. Jangan berikan kode ini kepada siapapun agar akun Anda tetap aman.

Jika Anda tidak merasa melakukan registrasi ini, silakan abaikan email ini.

Terima kasih,<br>
Panitia PPDB {{ config('app.name') }}
</x-mail::message>
