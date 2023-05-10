import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MailModel } from "../models/mail.model";
@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private dataUrl = "../../assets/Data/message.json"
    constructor(private http: HttpClient) {

    }

    public getMessage(): Observable<MailModel[]> {
        return this.http.get<MailModel[]>(this.dataUrl);
    }
}