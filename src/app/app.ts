import { Component, signal, viewChild } from '@angular/core';
import { XmlParserForm } from './components/xml-parser-form/xml-parser-form';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { BooksTable } from './components/books-table/books-table';

@Component({
  selector: 'app-root',
  imports: [XmlParserForm, BooksTable, MatStepperModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly MAX_STEP_INDEX = 1;
  public step = signal(0);

  private stepper = viewChild.required(MatStepper);
  private booksTable = viewChild.required(BooksTable);

  public nextStep(): void {
    // debugger;
    this.step.update(value => Math.min(value + 1, this.MAX_STEP_INDEX));
  }

  public prevStep(): void {
    this.step.update(value => Math.max(value + 1, 0));
  }

  public onReset(): void {
    this.step.set(0);
    this.stepper().reset();
    this.booksTable().onReset()
  }
}
