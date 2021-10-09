Rails.application.routes.draw do
  devise_for :usuario, :optional => true
  resources :usuarios
  resources :restaurantes
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
