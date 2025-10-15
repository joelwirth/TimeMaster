<?php

namespace App\Notifications;

use App\Models\Absence;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AbsenceRequestUpdated extends Notification
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
        $status = $this->absence->status === 'approved' ? 'genehmigt' : 'abgelehnt';

        return (new MailMessage)
                    ->subject('Ihr Abwesenheitsantrag wurde bearbeitet')
                    ->greeting('Hallo ' . $this->absence->user->name . '!')
                    ->line('Ihr Abwesenheitsantrag vom ' . $this->absence->start_date . ' bis ' . $this->absence->end_date . ' wurde soeben ' . $status . '.')
                    ->action('Meine Anträge ansehen', route('absences.index'))
                    ->line('Danke, dass Sie diese Anwendung nutzen!');
    }
}
