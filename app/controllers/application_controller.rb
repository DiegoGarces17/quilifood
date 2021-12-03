class ApplicationController < ActionController::Base
    before_action :configure_permitted_parameters, if: :devise_controller?
    before_action do
      I18n.locale = :es # Or whatever logic you use to choose.
    end
    def set_locale
      I18n.locale = request.compatible_language_from [:es]
    end
    protected
  
    def current_ability
      @current_ability ||= Ability.new(current_usuario)
    end
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:rol_id, :nusuario, :nombres, :apellidos, :telefono])
    end
end
