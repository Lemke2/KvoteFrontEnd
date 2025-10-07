import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent {
  date1 : string = "";
  date2 : string = "";
  sports: string[] = ["Football", "Basketball", "Tennis", "NFL", "Handball", "BasketballPlayers"];
  selectedSport : string = "";

  mapping1 : {[key: number] : {values : number[], name : string}} = {};
  mapping2 : {[key: number] : {values : number[], name : string}} = {};

  comparisonResult: {
        leftOnly: number[];
        rightOnly: number[];
        commonWithDiff: number[];
    } = { leftOnly: [], rightOnly: [], commonWithDiff: [] }; // Initialize to avoid undefined

  constructor(private userService: UserService) {}

  ngOnInit(){}

  GetFile1(){
    this.userService.getMappings(this.selectedSport, this.date1).subscribe({
      next: (data) => {
        this.mapping1 = data;
        console.log(this.mapping1);
      },

      error: (error) => {
        console.error(error);
      }
    })
  }

  GetFile2(){
    this.userService.getMappings(this.selectedSport, this.date2).subscribe({
      next: (data) => {
        this.mapping2 = data;
        console.log(this.mapping2);
      },

      error: (error) => {
        console.error(error);
      }
    })
  }

  getMapping1Keys(): number[] {
    return Object.keys(this.mapping1).map(Number);
  }

  getMapping2Keys(): number[] {
    return Object.keys(this.mapping2).map(Number);
  }

  compareMappings(): void {
    const leftKeys = this.getMapping1Keys();
    const rightKeys = this.getMapping2Keys();

    const leftOnly = leftKeys.filter(key => !rightKeys.includes(key));
    const rightOnly = rightKeys.filter(key => !leftKeys.includes(key));
    const commonWithDiff = leftKeys
        .filter(key => rightKeys.includes(key))
        .filter(key => {
            const left = this.mapping1[key];
            const right = this.mapping2[key];
            const valuesDiff = JSON.stringify(left.values) !== JSON.stringify(right.values);
            const nameDiff = left.name !== right.name;
            return valuesDiff || nameDiff;
        });

    this.comparisonResult = { leftOnly, rightOnly, commonWithDiff };
    }

  hasMappings(): boolean {
      return this.getMapping1Keys().length > 0 || this.getMapping2Keys().length > 0;
  }

  // Get CSS class for a key in mapping1
  getMapping1Class(key: number): string {
      if (!this.comparisonResult) return '';
      if (this.comparisonResult.leftOnly.includes(key)) return 'left-only';
      if (this.comparisonResult.commonWithDiff.includes(key)) return 'common-diff';
      return '';
  }

  // Get CSS class for a key in mapping2
  getMapping2Class(key: number): string {
      if (!this.comparisonResult) return '';
      if (this.comparisonResult.rightOnly.includes(key)) return 'right-only';
      if (this.comparisonResult.commonWithDiff.includes(key)) return 'common-diff';
      return '';
  }
}
