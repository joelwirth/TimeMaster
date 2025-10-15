<?php

namespace App\Notifications;

use App\Models\Absence;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AbsenceRequestCreated extends Notification
{
    use Queueable;

    public function __construct(public Absence $absence)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Neuer Abwesenheitsantrag')
                    ->greeting('Hallo!')
                    ->line('Ein neuer Abwesenheitsantrag wurde von ' . $this->absence->user->name . ' gestellt.')
                    ->action('Antrag ansehen', route('admin.absences.index'))
                    ->line('Danke, dass Sie diese Anwendung nutzen!');
    }
}
