var app = angular.module('printmemo', ['LocalForageModule']);

app.controller('PageCtrl', function($window, $q, $localForage) {
  var ctrl = this;
  ctrl.cards = [];
  ctrl.last_cards = [];

  ctrl._save = function() {
    var d1 = $localForage.setItem('cards', ctrl.cards);
    var d2 = $localForage.setItem('last_cards', ctrl.last_cards);
    return $q.all([d1, d2]);
  };
  ctrl.clearDB = function() {
    var d1 = $localForage.removeItem('cards');
    var d2 = $localForage.removeItem('last_cards');
    return $q.all([d1, d2]);
  };
  ctrl._load = function() {
    var d1 = $localForage.getItem('cards')
      .then(function(cards) {
        if (cards === null) {
          cards = [];
        }
        ctrl.cards = cards;
      });
    var d2 = $localForage.getItem('last_cards')
      .then(function(last_cards) {
        if (last_cards === null) {
          last_cards = [];
        }
        ctrl.last_cards = last_cards;
      });
    return $q.all([d1, d2]);
  };

  ctrl.addCard = function(text) {
    if (text === '') {
      return;
    }
    ctrl.cards.push({
      text: text,
      length: text.length
    });
    return ctrl._save();
  };

  ctrl.clear = function() {
    ctrl.last_cards = angular.copy(ctrl.cards);
    ctrl.cards.length = 0;
  };
  ctrl.restore = function() {
    ctrl.cards = angular.copy(ctrl.last_cards);
  };
  ctrl.canRestore = function() {
    return ctrl.cards.length === 0 && ctrl.last_cards.length !== 0;
  };

  ctrl.print = function() {
    $window.print();
  };

  ctrl.searchScriptures = function(term) {
    $http.get('https://www.lds.org/scriptures/search', {
      lang: 'eng',
      query: term,
    })
    .then(function(response) {
      console.log('response', response);
    });
  };

  ctrl._load();
});