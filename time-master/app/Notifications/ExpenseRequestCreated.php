<?php

namespace App\Notifications;

use App\Models\Expense;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExpenseRequestCreated extends Notification
{
    use Queueable;

    public function __construct(public Expense $expense)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Neuer Spesenantrag')
                    ->greeting('Hallo!')
                    ->line('Ein neuer Spesenantrag wurde von ' . $this->expense->user->name . ' über ' . $this->expense->amount . ' € eingereicht.')
                    ->action('Antrag ansehen', route('admin.expenses.index'))
                    ->line('Danke, dass Sie diese Anwendung nutzen!');
    }
}
