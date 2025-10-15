<?php

namespace App\Notifications;

use App\Models\Expense;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExpenseRequestUpdated extends Notification
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
        $status = $this->expense->status === 'approved' ? 'genehmigt' : 'abgelehnt';

        return (new MailMessage)
                    ->subject('Ihr Spesenantrag wurde bearbeitet')
                    ->greeting('Hallo ' . $this->expense->user->name . '!')
                    ->line('Ihr Spesenantrag vom ' . $this->expense->expense_date . ' über ' . $this->expense->amount . ' € wurde soeben ' . $status . '.')
                    ->action('Meine Anträge ansehen', route('expenses.index'))
                    ->line('Danke, dass Sie diese Anwendung nutzen!');
    }
}
