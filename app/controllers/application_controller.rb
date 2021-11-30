class ApplicationController < ActionController::Base
    before_action :configure_permitted_parameters, if: :devise_controller?

    protected
  
    def current_ability
      @current_ability ||= Ability.new(current_usuario)
    end
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:rol_id, :nusuario, :nombres, :apellidos, :telefono])
    end
end
