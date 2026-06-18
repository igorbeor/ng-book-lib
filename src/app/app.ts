import { Component } from '@angular/core';
import { XmlParserForm } from './components/xml-parser-form/xml-parser-form';

@Component({
  selector: 'app-root',
  imports: [XmlParserForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
