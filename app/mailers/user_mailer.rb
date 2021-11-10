class UserMailer < ApplicationMailer
  default from: 'noreply@taskmanager.com'
  layout 'user_mailer'

  def task_created
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: 'New Task Created')
  end

  def task_deleted
    @user = params[:user]
    @task_id = params[:task_id]

    mail(to: @user.email, subject: "Task Deleted")
  end

  def task_updated
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: "Task Updated")
  end

  def password_reset(user)
    @user = user
    mail(to: user.email, subject: "Password reset")
  end
  
end
