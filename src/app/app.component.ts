import { Component, OnInit } from '@angular/core';
import { MailModel } from './models/mail.model';
import { MenuModel } from './models/menu.model';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public mails: MailModel[] = [];
  public allMails: MailModel[] = [];
  public menus: MenuModel[] = [];
  public isSelectAll = false;
  public page: number = 1;
  public pageSize: number = 10;
  public maxPage: number = 0;
  public firstItem: number = 1;
  public lastItem: number = 0;

  constructor(private messageService: MessageService){

  }

  ngOnInit(){
    this.getAllMessage();
    this.menus = this.getMenus();
  }

  getMenus(): MenuModel[]{
    return [
      {
        text: "Inbox",
        icon: "inbox",
        count: 0
      },
      {
        text: "Starred",
        icon: "star",
        count: 0
      },
      {
        text: "Snoozed",
        icon: "watch_later",
        count: 0
      },
      {
        text: "Important",
        icon: "bookmark",
        count: 0
      },
      {
        text: "Sent",
        icon: "mail_outline",
        count: 0
      },
      {
        text: "Drafts",
        icon: "drafts",
        count: 0
      },
      {
        text: "Chats",
        icon: "chat_bubble",
        count: 0
      },
      {
        text: "Scheduled",
        icon: "date_range",
        count: 0
      },
      {
        text: "All Mail",
        icon: "mail",
        count: 0
      },
      {
        text: "Spam",
        icon: "error_outline",
        count: 0
      },
      {
        text: "Trash",
        icon: "delete",
        count: 0
      }
    ];
  }

  getAllMessage() {
    this.messageService.getMessage().subscribe(result=>{
    this.allMails =  result.filter(t=> {
      let val = new Date(t.dateTime);
      return new Date(t.dateTime).getFullYear() >= 2022
    });
      this.maxPage = Math.ceil(this.allMails.length/this.pageSize);
      this.paginateMail();
    });
  }

  next(){
    this.page++;
    this.paginateMail();
  }

  prev(){
    this.page--;
    this.paginateMail();
  }

  paginateMail() {
    this.mails = this.allMails.slice(this.lastItem, this.page* this.pageSize - 1);
    this.firstItem = this.page * this.mails.length - this.mails.length;
    this.lastItem = this.mails.length;
  }

  selectAll(){
    this.mails.forEach(t => t.isSelected = this.isSelectAll);
  }

  refresh(){
    this.mails = [];
    this.allMails = [];
    this.page = 1;
    this.getAllMessage();
  }
}
