class UserMailer < ApplicationMailer
  default from: 'noreply@taskmanager.com'

  def task_created
    user = params[:user]

    mail(to: user.email, subject: 'New Task Created')
  end
end
