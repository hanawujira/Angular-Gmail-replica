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
  public filteredMails: MailModel[] = [];
  public menus: MenuModel[] = [];
  public isSelectAll = false;
  public page: number = 1;
  public pageSize: number = 10;
  public maxPage: number = 0;
  public firstItem: number = 1;
  public lastItem: number = 0;
  public selectedMenu: string = 'Inbox';
  public searchText: string = '';

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
      this.applyFilters();
    });
  }

  applyFilters() {
    // First apply menu filter
    let filtered = this.allMails;
    
    if (this.selectedMenu === 'Starred') {
      filtered = this.allMails.filter(m => m.isStarred);
    } else if (this.selectedMenu === 'Important') {
      filtered = this.allMails.filter(m => m.isImportant);
    } else if (this.selectedMenu === 'Inbox') {
      filtered = this.allMails;
    }
    
    // Then apply search filter
    if (this.searchText && typeof this.searchText === 'string' && this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(m => 
        m.senderName?.toLowerCase().includes(search) ||
        m.mailTitle?.toLowerCase().includes(search) ||
        m.message?.toLowerCase().includes(search)
      );
    }
    
    this.filteredMails = filtered;
    this.maxPage = Math.ceil(this.filteredMails.length / this.pageSize);
    this.page = 1;
    this.updateMenuCounts();
    this.paginateMail();
  }

  updateMenuCounts() {
    this.menus.forEach(menu => {
      if (menu.text === 'Inbox') {
        menu.count = this.allMails.length;
      } else if (menu.text === 'Starred') {
        menu.count = this.allMails.filter(m => m.isStarred).length;
      } else if (menu.text === 'Important') {
        menu.count = this.allMails.filter(m => m.isImportant).length;
      }
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
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.mails = this.filteredMails.slice(startIndex, endIndex);
    this.firstItem = this.filteredMails.length > 0 ? startIndex + 1 : 0;
    this.lastItem = Math.min(endIndex, this.filteredMails.length);
  }

  selectAll(){
    this.mails.forEach(t => t.isSelected = this.isSelectAll);
  }

  refresh(){
    this.mails = [];
    this.allMails = [];
    this.filteredMails = [];
    this.page = 1;
    this.getAllMessage();
  }

  filterByMenu(menu: MenuModel) {
    this.selectedMenu = menu.text || '';
    this.applyFilters();
  }

  onSearch(searchText: string) {
    this.searchText = searchText || '';
    this.applyFilters();
  }

  onStarToggle() {
    this.updateMenuCounts();
  }

  onImportantToggle() {
    this.updateMenuCounts();
  }

  hasSelectedMails(): boolean {
    return this.mails.some(m => m.isSelected);
  }

  deleteSelected() {
    const selectedIds = this.mails
      .filter(m => m.isSelected)
      .map(m => m.mailId);
    
    if (selectedIds.length > 0) {
      // Remove selected mails from allMails array
      this.allMails = this.allMails.filter(m => !selectedIds.includes(m.mailId));
      
      // Reset select all checkbox
      this.isSelectAll = false;
      
      // Reapply filters and pagination
      this.applyFilters();
    }
  }
}
