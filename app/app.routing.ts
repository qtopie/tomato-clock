import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ClockComponent } from "./clock/clock.component";

const routes: Routes = [
    { path: "", redirectTo: "clock", pathMatch: "full" },
    { path: "clock", component: ClockComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }