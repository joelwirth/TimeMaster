<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExpenseCategory::firstOrCreate(['name' => 'Reisekosten']);
        ExpenseCategory::firstOrCreate(['name' => 'Verpflegung']);
        ExpenseCategory::firstOrCreate(['name' => 'Unterkunft']);
        ExpenseCategory::firstOrCreate(['name' => 'Sonstiges']);
    }
}
