import Service from '@ember/service';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import { tracked } from '@glimmer/tracking';

export default class InterfaceService extends Service {
  @service settings;

  @tracked sidebarIsOpen = (window.outerWidth >= 768);

  initInterface() {
    setTimeout(() => {
      this.setInterfaceMecanism();
    }, 10)
  }

  toggleSidebar() {
    if (this.sidebarIsOpen) {
      this.sidebarIsOpen = false;
    } else {
      this.sidebarIsOpen = true;
    }

    $("body").toggleClass("sidebar-toggled");
  }

  closeSidebar() {
    if (this.sidebarIsOpen) {
      this.sidebarIsOpen = false;
      $("body").toggleClass("sidebar-toggled");
    }
  }

  openSidebar() {
    if (!this.sidebarIsOpen) {
      this.sidebarIsOpen = true;
      $("body").toggleClass("sidebar-toggled");
    }
  }

  setInterfaceMecanism() {
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      this.sidebarIsOpen = false;
    } else {
      $("body").removeClass("sidebar-toggled");
      this.sidebarIsOpen = true;
    }

    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
    }

    $(window).resize(function () {
      if ($(window).width() < 768) {
        if ($('.sidebar .collapse').length) {
          $('.sidebar .collapse').collapse('hide');
        }
      }

      // Toggle the side navigation when window is resized below 480px
      if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
        $("body").addClass("sidebar-toggled");
        $(".sidebar").addClass("toggled");
      }
    });
  }
}
