json.extract! usuario, :id, :nusuario, :nombres, :apellidos, :telefono, :email, :created_at, :updated_at
json.url usuario_url(usuario, format: :json)
