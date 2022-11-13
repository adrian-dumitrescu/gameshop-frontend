import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 44.41811945013775,
    lng: 26.159469974291394
  };
  zoom = 18;
  markerOptions: google.maps.MarkerOptions = {
    draggable: true
  };

  // markerPositions: google.maps.LatLngLiteral[] = [];
  markerPositions = [
    { lat: 44.41811945013775, lng: 26.159469974291394 }
  ];

  
    addMarker(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.markerPositions.push(event.latLng.toJSON());
    }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

}
