$(function() {
  // Remove button after selected
  $(".qbutton").click(function() {
    $(this).addClass("disabled");
    $(this).remove();
    });
});