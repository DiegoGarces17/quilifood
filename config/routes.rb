Rails.application.routes.draw do
  root :to => "restaurantes#mapa"
  devise_for :usuarios, :optional => true
  
  get '/mapa', to: "restaurantes#mapa"
  resources :restaurantes
  resources :usuarios
    # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
    
  end
