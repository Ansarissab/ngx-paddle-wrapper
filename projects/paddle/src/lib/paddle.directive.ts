import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { PaddleEventCallbackData } from './interfaces';
import { PaddleService } from './paddle.service';

@Directive({
  selector: '[ngxPaddle]',
})
export class PaddleDirective {
  @Output() onCheckoutEvent: EventEmitter<PaddleEventCallbackData> =
    new EventEmitter();
  @Input() vendor: number;
  @Input() product: number;
  @Input() title?: string;
  @Input() message?: string;
  @Input() coupon?: string;
  @Input() email?: string;
  @Input() method: 'inline' | 'overlay' = 'overlay';

  // Should be define if use 'inline' checkout
  @Input() frameTarget?: string;
  @Input() frameStyle?: string;
  @Input() frameInitialHeight?: number;

  constructor(private paddleServ: PaddleService) {}

  async ngOnInit() {
    await this.paddleServ.create({
      vendor: this.vendor,
      eventCallback: (data: PaddleEventCallbackData) => {
        this.onCheckoutEvent.emit(data);
      },
    });
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    this.paddleServ.open({
      method: this.method,
      product: this.product,
      title: this.title,
      message: this.message,
      coupon: this.coupon,
      email: this.email,
      frameTarget: this.frameTarget,
      frameStyle: this.frameStyle,
      frameInitialHeight: this.frameInitialHeight,
    });
  }
}
