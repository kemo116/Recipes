import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-followers-dialog',
  templateUrl: './followers-dialog.component.html',
  styleUrls: ['./followers-dialog.component.css']
})
export class FollowersDialogComponent {
  users: any[];
  isFollowers: boolean;

  constructor(
    public dialogRef: MatDialogRef<FollowersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.users = data.users;
      this.isFollowers = data.isFollowers;
    }

  ngOnInit(): void {
    // Initialize component properties
  }

  close(): void {
    this.dialogRef.close();
  }
}
