import { notification } from 'antd';
import $ from 'jquery';
export class NotificationGenerator {

  static pastNotifications = {}

  static getDurationByType(type) {
    switch (type) {
      case 'success':
        return 3.5;

      case 'error':
        return 0;

      default:
        return 3.5;
    }
  }
 
  static genereNotification(message, type)
{
  var icone =' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>';
  if(type==="error")
  {
    type = "danger";
    icone='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
  }
  else
  {
    type = "success";
  }
  var rslt = '<div class="alert alert-'+type+'">'+
       ' <div class="container">'+
        '    <div class="alert-icon">'+icone+
          '  </div>'+
           ' <button type="button"  class="close" data-dismiss="alert" aria-label="Close">'+
            '    <span aria-hidden="true">&times;</span>'+
            '</button>'+message+
        '</div>'+
    '</div>';
    $("#divalert").html(rslt) ;
    $("#divalert").fadeIn(2000);
    $("#divalert").fadeOut(3000);
    return false;
}
  static raise(message, type) {

    /* const newNotification = {
      key: Date.now(),
      message: message,
      description: description,
      type: type,
      duration: this.getDurationByType(type),
      isClean: false,
    }; */
    this.genereNotification(message, type);
    /* notification[type] ({
      key: newNotification.type,
      placement: 'topRight',
      message: newNotification.message,
      description: newNotification.description,
      duration: newNotification.duration,
      onClose: () => (this.pastNotifications[newNotification.key] = newNotification),
    }); */
  }
}
