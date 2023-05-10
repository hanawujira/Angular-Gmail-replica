export class MailModel {
    mailId: string | undefined;
    senderId: number | undefined;
    senderName: string | undefined;
    mailTitle: string | undefined;
    isStarred: boolean = false;
    isImportant: boolean = false;
    isSelected: boolean = false;
    message: string | undefined;
    hasAttachment: boolean = false;
    dateTime: any | undefined;
}