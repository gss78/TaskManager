class Web::BoardsController < Web::ApplicationController
  before_action :authenticate_user!
  def show
    render(react_component: 'App', props: {id:current_user.id, type: current_user.type})
  end
end

