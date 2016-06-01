/* global angular */
angular.module('app').component('application', { // Rename
  bindings: {},
  controller: function () {
    this.activePage = 'titleScreen';
    var scope = this;

    var navigateTo = function (event) {
      if (!event.navigationTarget || event.navigationTarget === '') {
        return;
      }
      scope.activePage = event.navigationTarget;
    };

    document.addEventListener('application-navigation', navigateTo);
  },
  templateUrl: 'Application.template.html',
  transclude: {}
});
