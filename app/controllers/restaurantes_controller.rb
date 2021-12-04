class RestaurantesController < ApplicationController
  load_and_authorize_resource except: :mapa
  before_action :set_restaurante, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token
  # GET /restaurantes or /restaurantes.json
  def index
    if params[:filtro]
      nombre_filtro = params[:filtro][:nombre]
      res_filtrados = Restaurante.all.where("nombre ILIKE '%#{nombre_filtro}%' ")
      @restaurantes = res_filtrados
    else
      @restaurantes = Restaurante.all.with_attached_avatar
    end
    respond_to do |format| 
      format.html
      format.json {render json: @restaurantes.map{|restaurante|restaurante.as_json.merge({avatar: url_for(restaurante.avatar)})}}
    end
  end

  # GET /restaurantes/1 or /restaurantes/1.json
  def show
    respond_to do |format|    
      format.html
      format.json { render json: @restaurante.as_json.merge({avatar: url_for(@restaurante.avatar)}) }
    end  
  end

  # GET /restaurantes/new
  def new
    @restaurante = Restaurante.new
  end

  # GET /restaurantes/1/edit
  def edit
  end

  # POST /restaurantes or /restaurantes.json
  def create
    
    @restaurante = Restaurante.new(restaurante_params)
    @restaurante.propietario_id = current_usuario.id
    
    respond_to do |format|
      if @restaurante.save
        format.html { redirect_to @restaurante, notice: "¡Restaurante creado exitosamene!" }
        format.json { render :show, status: :created, location: @restaurante }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @restaurante.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /restaurantes/1 or /restaurantes/1.json
  def update
    respond_to do |format|
      if @restaurante.update(restaurante_params)
        format.html { redirect_to @restaurante, notice: "Restaurante was successfully updated." }
        format.json { render :show, status: :ok, location: @restaurante }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @restaurante.errors, status: :unprocessable_entity }
      end
    end
  end

  def mapa
    
    render "mapa"
  end
  # DELETE /restaurantes/1 or /restaurantes/1.json
  def destroy
    @restaurante.destroy
    respond_to do |format|
      format.html { redirect_to restaurantes_url, notice: "Restaurante was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_restaurante
      @restaurante = Restaurante.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def restaurante_params
      params.require(:restaurante).permit(:nombre, :direccion, :telefono, :lng, :lat, :avatar, :image)
    end
end
