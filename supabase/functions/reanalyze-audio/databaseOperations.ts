import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface UpdateResult {
  success: boolean;
  error?: string;
}

export async function updateDatabase(
  supabaseClient: any,
  meetingId: string,
  analysis: any,
  transcriptionId: string
): Promise<UpdateResult> {
  try {
    // Update meeting minutes with new analysis
    const { error: updateError } = await supabaseClient
      .from('meeting_minutes')
      .update({
        summary: analysis.summary,
        last_modified: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (updateError) throw updateError;

    // Update transcription history
    await supabaseClient
      .from('transcription_history')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', transcriptionId);

    // Insert participants
    if (analysis.participants?.length > 0) {
      await supabaseClient
        .from('meeting_participants')
        .upsert(
          analysis.participants.map((p: any) => ({
            meeting_id: meetingId,
            name: p.name,
            role: p.role
          }))
        );
    }

    // Insert agenda items
    if (analysis.agendaItems?.length > 0) {
      await supabaseClient
        .from('agenda_items')
        .upsert(
          analysis.agendaItems.map((item: any, index: number) => ({
            meeting_id: meetingId,
            title: item.title,
            discussion: item.discussion,
            order_index: index
          }))
        );
    }

    // Insert action items
    if (analysis.actionItems?.length > 0) {
      await supabaseClient
        .from('action_items')
        .upsert(
          analysis.actionItems.map((item: any) => ({
            meeting_id: meetingId,
            task: item.task,
            responsible: item.responsible,
            deadline: item.deadline,
            status: 'pending'
          }))
        );
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating database:', error);
    return { success: false, error: error.message };
  }
}