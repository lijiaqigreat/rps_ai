var botR=React.createClass({
  render: function(){
    return React.DOM.iframe({
      srcDoc:"<script>"+this.state.bot_text+"</script>",
      className:"wasteland"
    });
  }
});
