class Api::ApplicationController < ApplicationController
  include AuthHelper
  include Pundit
  helper_method :current_user
  respond_to :json

  after_action :verify_authorized, except: [:index, :show, :update]

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def user_not_authorized
    render json: "You are not authorized to perform this action.", status: 403
  end
end
