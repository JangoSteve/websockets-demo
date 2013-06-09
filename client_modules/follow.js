msg.install("follow.js", "#");

var allClients = {},
    $container = $('#connected-clients'),
    heightSet = false,
    follow = false;

var setContainerHeight = function() {
  heightSet = true;
  var containerTop = $container.offset().top,
      screenBottom = $(window).height(),
      heightDiff = screenBottom - containerTop;

  $container.css({height: $container.height(), 'min-height': heightDiff});
};

var setClient = function(id) {
  var $client = $('.client[data-id="' + id + '"]');
  if (!heightSet) {
    setContainerHeight();
  }
  allClients[id] = $client;

  $client.css({position: 'absolute'});
};

msg.follow = function(data) {
  if (!allClients[data.sender]) {
    setClient(data.sender);
  }
  allClients[data.sender].css({top: data.y, left: data.x});
};

$('#connected-clients').bind('mousemove', function (e) {
  if (follow) {
    var message = JSON.stringify({type: 'follow', x: e.pageX, y: e.pageY});
    connection.send(message);
  }
});

$(document).delegate('.client[data-id]', 'click', function(e) {
  var $this = $(this);
  if ($this.data('id') === connection.id) {
    if (follow) {
      msg.log("Follow mode disabled.");
    } else {
      msg.log("Follow mode enabled.");
    }
    follow = !follow;
    $this.toggleClass('highlight');
  }
});
