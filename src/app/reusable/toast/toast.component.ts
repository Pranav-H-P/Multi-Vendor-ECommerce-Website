import { NgClass } from '@angular/common';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent{
  @Input() message: string = '';
  @Input() visible: boolean = true;
  @Input() success: boolean = true;

}