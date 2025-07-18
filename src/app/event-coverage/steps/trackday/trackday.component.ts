import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../../core/services/environment.service';

interface Circuit {
  id: number;
  nom: string;
  adresseCircuit: string;
  responsablePiste: string;
  mailResponsablePiste: string;
  pays: string;
}

interface Organizer {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
}

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';

@Component({
  selector: 'app-trackday',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSliderModule,
    MatNativeDateModule
  ],
  templateUrl: './trackday.component.html',
  styleUrls: ['./trackday.component.scss', '../../../app.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class TrackdayComponent {
  @Input() form!: FormGroup;
  @Input() circuits: Circuit[] = [];
  @Input() isLoadingCircuits: boolean = true;
  @Output() organizerNameChange = new EventEmitter<string>();
  organizers: Organizer[] = [];
  isLoadingOrganizers = true;
  today = new Date();

  private apiUrl: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private envService: EnvironmentService
  ) {
    this.apiUrl = this.envService.apiUrl;
    registerLocaleData(fr);
    this.loadOrganizers();
  }

  private loadOrganizers() {
    this.http.get<Organizer[]>(`${this.apiUrl}/api/allapporteurs`).subscribe(
      (organizers) => {
        this.organizers = organizers.filter(org => org.lastName !== "VAX CONSEILS");
        this.isLoadingOrganizers = false;
      },
      (error) => {
        console.error('Error loading organizers:', error);
        this.isLoadingOrganizers = false;
      }
    );
  }

  onOrganizerChange(event: any) {
    const selectedOrganizer = this.organizers.find(org => org.id === event.value);
    if (selectedOrganizer) {
      this.organizerNameChange.emit(selectedOrganizer.lastName);
    }
  }

  get isPilot() {
    return this.form.get('role')?.value === 'pilote';
  }

  get isPassenger() {
    return this.form.get('role')?.value === 'passager';
  }

  onRoleChange(event: any) {
    const role = event.value;
    if (role !== 'pilote') {
      this.form.get('vehicleType')?.reset();
    }
  }
}
