module AttachmentsService
  class << self
    def file_url(file)
      Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
    end
  end
end