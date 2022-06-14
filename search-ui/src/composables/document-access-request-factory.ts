import { reactive } from 'vue'

import { AccessRequestsHistoryI, DocumentAccessRequestsI, CreateDocumentResponseI } from '@/interfaces'
import { getActiveAccessRequests, createDocumentAccessRequest } from '@/requests'


const documentAccessRequest = reactive({
    requests: [],
    _error: null,
    _loading: false,
    _saving: false
}) as DocumentAccessRequestsI

export const useDocumentAccessRequest = () => {
    // functions  to manage the filing history
    const clearAccessRequestHistory = () => {
        documentAccessRequest._error = null
        documentAccessRequest.requests = []
    }


    const loadAccessRequestHistory = async (identifier: string) => {
        documentAccessRequest._loading = true
        clearAccessRequestHistory()
        const accessRequestsResponse: AccessRequestsHistoryI = await getActiveAccessRequests(identifier)
        if (accessRequestsResponse.error) {
            documentAccessRequest._error = accessRequestsResponse.error
        }
        else {
            documentAccessRequest.requests = accessRequestsResponse.documentAccessRequests
        }
        documentAccessRequest._loading = false
    }

    const createAccessRequest = async (identifier: string, selectedDocs: any) => {
        documentAccessRequest._saving = true

        const response: CreateDocumentResponseI = await createDocumentAccessRequest(identifier, selectedDocs)
        if (response.error) {
            documentAccessRequest._error = response.error
        }        
        documentAccessRequest._saving = false
    }

    return {
        documentAccessRequest,
        clearAccessRequestHistory,
        createAccessRequest,
        loadAccessRequestHistory
    }
}