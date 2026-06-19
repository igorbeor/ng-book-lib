import { Component, signal } from '@angular/core';
import { XmlParserForm } from './components/xml-parser-form/xml-parser-form';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [XmlParserForm, MatStepperModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly MAX_STEP_INDEX = 1;
  public step = signal(0);

  public nextStep(): void {
    this.step.update(value => Math.min(value + 1, this.MAX_STEP_INDEX));
  }

  public prevStep(): void {
    this.step.update(value => Math.max(value + 1, 0));
  }
}
