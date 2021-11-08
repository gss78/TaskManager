class Web::PasswordResetsController < Web::ApplicationController
  
  def new
  end

  def create
    @user = User.find_by(email: user_params.fetch(:email))
    if @user
      @user.prepare_reset_data
      @user.send_password_reset_email
      flash[:info] = "Email sent with password reset instructions"
      redirect_to root_url
    else
      flash.now[:danger] = "Email address not found"
      render 'new'
    end
  end  

  def update
    get_user
    valid_user
    check_expiration
    if user_params.fetch(:password).empty?
      flash[:danger] = "Password can't be empty"
      render 'edit'
    elsif @user.update(user_params)
      sign_in @user
      @user.clear_reset_data
      flash[:success] = "Password has been reset"
      redirect_to root_url
    else
      render 'edit'
    end
  end

  def edit
    get_user
    valid_user
    check_expiration
  end
  
  private

    def user_params
      params.require(:user).permit(:password, :password_confirmation, :email)
    end

    def reset_params
      params.permit(:id, :email)
    end

    def get_user      
      @user = User.find_by(email: reset_params.fetch(:email))
    end

    def valid_user
      unless (@user && @user.authenticated?(reset_params.fetch(:id)))
        redirect_to root_url
      end
    end

    def check_expiration
      if @user.password_reset_expired?
        flash[:danger] = "Password reset has expired."
        redirect_to new_password_reset_url
      end 
    end

end
