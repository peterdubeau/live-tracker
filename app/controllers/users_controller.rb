class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  # def create
  #   @user = User.new(user_params)

  #   if @user.save
  #     render json: @user, status: :created, location: @user
  #   else
  #     render json: @user.errors, status: :unprocessable_entity
  #   end
  # end

  def create 
    @user = User.new(user_params)
    @game = Game.find(user_params['game_id'])
    if @user.save
      GamesChannel.broadcast_to(@game, {game: @game.code, user: @user, type: "new_user"})
    end
    render json: @user
  end

  # PATCH/PUT /users/1
  def update

    @user.update(user_params)
    @game = Game.find(user_params['game_id'])

    if @user.update(user_params)
      GamesChannel.broadcast_to(@game, {game: @game.code, user: @user, type: "update_user" })
    else
      render json: @user.errors, status: :unprocessable_entity
    end
 
    ActionCable.server.broadcast "users_channel", { type: "update_user", data: @user }

  end

  # DELETE /users/1
  def destroy
    @game = Game.find(user_params['game_id'])
    if @user.destroy
      GamesChannel.broadcast_to(@game, {game: @game.code, user: @user, type: "delete_user" })
    else
      ender json: @user.errors, status: :unprocessable_entity
    end

  end

  # def sorted
  #   @list = Game.find_by code: (params[:code])
  #   @users = @list.users.all
  #   @game = @users.sort_by{|k| k["initiative"]}
    

  #   render json: @game
  #   GamesChannel.broadcast_to(@game, {game: @game.code, users: @game.users.all, type: "sort_list"})
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:username, :is_admin, :initiative, :game_id)
    end
end
