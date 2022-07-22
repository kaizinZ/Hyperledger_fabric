import React from "react"
import { useParams } from "react-router"

export const Organization: React.VFC = () => {
    const params = useParams<{organizationId: string}>()

    return <div>
        {params.organizationId}
    </div>
}