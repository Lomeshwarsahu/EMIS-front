// import { NgModule, ModuleWithProviders } from '@angular/core';
// import { CollapseDirective } from './collapse.directive';

// @NgModule({
//   imports: [CollapseDirective],        
//   exports: [CollapseDirective]
// })
// export class CollapseModule {

// static forRoot(): ModuleWithProviders<CollapseModule> {
//     return {
//       ngModule: CollapseModule,
//       providers: []
//     };
//   }
  
// }



import { NgModule,ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseDirective } from './collapse.directive';

@NgModule({
  declarations: [CollapseDirective], 
  imports: [CommonModule],
  exports: [CollapseDirective] 
})
export class CollapseModule {
  static forRoot(): ModuleWithProviders<CollapseModule> {
    return {
      ngModule: CollapseModule,
      providers: []
    };
  }
}